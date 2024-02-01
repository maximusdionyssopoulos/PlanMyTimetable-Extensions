import { createEffect, createSignal, onMount, For, Show } from "solid-js";
import { ChevronDown, ChevronUp } from "lucide-solid";

type CourseStructure = Record<string, { semester: Semester; visible: boolean }>;

function App() {
  const [count, setCount] = createSignal<CourseStructure>({});
  const [classes, setClasses] = createSignal<Subject[]>([]);

  const getCurrentTab = async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    return tab;
  };

  const toggleVisiblity = (semester_name: string) => {
    const course = count();
    setCount(() => ({
      ...course,
      [semester_name]: {
        ...course[semester_name],
        visible: !course[semester_name].visible,
      },
    }));
  };

  /**
   * This function runs inside the "world" of the page, meaning it has access to variables
   * this fetches data, creates objects before returning them
   */
  const capture = async (classes: Subject[]) => {
    /** 
     * NanoID - Copyright 2017 Andrey Sitnik - MIT License
        The MIT License (MIT)

        Copyright 2017 Andrey Sitnik <andrey@sitnik.ru>

        Permission is hereby granted, free of charge, to any person obtaining a copy of
        this software and associated documentation files (the "Software"), to deal in
        the Software without restriction, including without limitation the rights to
        use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
        the Software, and to permit persons to whom the Software is furnished to do so,
        subject to the following conditions:

        The above copyright notice and this permission notice shall be included in all
        copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
        FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
        COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
        IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
        CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */
    const nanoid = (t = 21) =>
      crypto
        .getRandomValues(new Uint8Array(t))
        .reduce(
          (t, e) =>
            (t +=
              (e &= 63) < 36
                ? e.toString(36)
                : e < 62
                ? (e - 26).toString(36).toUpperCase()
                : e > 62
                ? "-"
                : "_"),
          ""
        );
    const selectType = (type: string) => {
      switch (type) {
        case "Lecture":
          return 0;
        case "Lectorial":
          return 0;
        case "Tutorial":
          return 1;
        case "Workshop":
          return 2;
        case "Practical":
          return 3;
        default:
          return 4;
      }
    };
    const data = await Promise.all(
      classes.map(async (course, index) => {
        return Promise.all(
          Object.values(course.groups).map(async (group) => {
            console.log(
              `Downloading group ${course.description} - ${group.activity_group_code}`
            );
            const url = new URL(window.location.href);
            const token = url.searchParams.get("ss");

            const path_base = window.location.pathname
              .split("/")
              .slice(0, -1)
              .join("/");

            // create url to fetch data from
            const fetchUrl = new URL(
              `${url.origin}${path_base}/rest/student/${
                window.data.student.student_code
              }/subject/${course.subject_code}/group/${
                group.activity_group_code
              }/activities/?${"ss"}=${token}`
            );

            // fetch individual class data
            const request = await fetch(fetchUrl);

            if (request.status === 200) {
              let data = await request.json();
              // create object for class
              const classs = {
                id: nanoid(),
                title: course.description,
                courseCode: course.callista_code ?? course.subject_code,
                type: selectType((Object.values(data) as any)[0].activityType),
                colour: index,
                options: Object.values(data).map((item: any) => {
                  const option: any = {
                    day: item.day_of_week,
                    start: item.start_time,
                    duration: item.duration,
                    location: item.location,
                    campus_description: item.campus_description,
                    grouped: false,
                    grouped_code: "",
                  };
                  if (item.activity_code.match(/\d{2}-P[1-9]/g)) {
                    option.grouped = true;
                    option.grouped_code = item.activity_code;
                  }
                  return option;
                }),
              };
              return classs;
            } else {
              throw "Problem retreiving data. Please refresh the page and try again. If the problem persists, please open a new issue on Github.";
            }
          })
        );
      })
    );
    console.log(data);
    window.postMessage({
      from: "s.js",
      data: data,
    });
    // TODO: get message and jsonCRUSH data, before opening a new window with data see lines #190 to #196 of bookmarklet
  };

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.id === browser.runtime.id) {
      const course = Object.entries(message).map(([name, item], index) => [
        name,
        { semester: item as Semester, visible: index === 0 },
      ]);
      setCount(Object.fromEntries(course));
    }
  });

  // createEffect(() => {
  //   console.log(count());
  // });

  onMount(async () => {
    await browser.scripting.executeScript({
      target: { tabId: (await getCurrentTab()).id ?? 0 },
      files: ["/load_world.js"],
    });
  });

  return (
    <div class="group dark:bg-neutral-800 dark:text-white w-[14rem] flex flex-col  ">
      <div class="space-y-2 p-2 h-[17rem] overflow-y-scroll scrollbar group-hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500/80 ">
        <For each={Object.entries(count())}>
          {([semester_name, semester]) => (
            <div class="border-b last:border-b-0 dark:border-neutral-600 pb-2">
              <div class="flex flex-row  p-1 px-2 justify-between ">
                <div class="flex flex-row items-center gap-2">
                  <button
                    class="inline-flex gap-1 items-center font-medium text-sm"
                    onClick={() => toggleVisiblity(semester_name)}
                  >
                    <ChevronDown class=" size-4" />
                    {semester_name}
                  </button>
                </div>
                <input
                  type="checkbox"
                  name="semester"
                  value={semester_name}
                  id={`semester_${semester_name}`}
                />
              </div>
              <Show when={semester.visible}>
                <ClassList semester={semester.semester} />
              </Show>
            </div>
          )}
        </For>
      </div>
      <button
        class="w-24 m-0.5 place-self-center min-h-7  bg-yellow-400 text-yellow-800 px-2 rounded-md hover:bg-yellow-500"
        onClick={async () => {
          await browser.scripting.executeScript({
            target: { tabId: (await getCurrentTab()).id ?? 0 },
            func: capture,
            world: "MAIN",
            args: [classes()],
          });
        }}
      >
        Capture
      </button>
    </div>
  );
}

interface classListProps {
  semester: Semester;
}
const ClassList = ({ semester }: classListProps) => (
  <ul class="list-disc list-inside px-2">
    <For each={Object.values(semester)}>
      {(item) => (
        <li class="text-xs">
          {item.description} - {item.callista_code}
        </li>
      )}
    </For>
  </ul>
);

type ActivityGroup = {
  subject_code: string;
  activity_group_code: string;
  description: string;
  num_flagged_timeslots: string;
  status: string;
  auto_single: string;
  min_prefs: number;
  visible_acts_cnt?: number;
  single_act: string;
  allow_justification: string;
  allow_waitlist: string;
  show_availability: string;
  act_cnt: number;
};

type Subject = {
  subject_code: string;
  description: string;
  manager: string;
  email_address: string;
  faculty: string;
  semester: string;
  semester_description: string;
  campus: string;
  campus_description: string;
  timezone: string;
  showOnTT: string;
  display_subject_code: string;
  callista_code: string;
  groups: Record<string, ActivityGroup>;
};

type Semester = Record<string, Subject>;

export default App;
