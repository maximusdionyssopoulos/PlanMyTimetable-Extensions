import {
  createSignal,
  onMount,
  For,
  Show,
  type Accessor,
  type Setter,
} from "solid-js";
import { ChevronDown, ChevronUp } from "lucide-solid";
import JSONCrush from "jsoncrush";

type CourseStructure = Record<string, { semester: Semester; visible: boolean }>;
type CaptureState = "IDLE" | "CAPTURING" | "ERROR" | "LOADING";
function App() {
  //////////////////////////////////////////////////////////////////////////////////////////////////
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
                // @ts-ignore
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
    return data.flat();
  };

  const getStudentData = () => {
    // @ts-ignore
    return window.data.student.student_enrolment_sem;
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////
  const [course, setCourse] = createSignal<CourseStructure>({});
  const [classes, setClasses] = createSignal<Subject[]>([]);
  const [captureState, setCaptureState] = createSignal<CaptureState>("LOADING");

  const getCurrentTab = async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    return tab;
  };

  const toggleVisiblity = (semester_name: string) => {
    setCourse((course) => ({
      ...course,
      [semester_name]: {
        ...course[semester_name],
        visible: !course[semester_name].visible,
      },
    }));
  };
  /**
   * This method is to check whether a semester is selected by checing whether every element in semester is in classes
   * @param semester
   * @returns
   */
  const isSemSelected = (semester: Semester) => {
    return Object.values(semester).every((item) => classes().includes(item));
  };

  /**
   * This function will update the classes array when the semester checkbox is ticked/unticked
   * if the semester is already selected, then remove the classes from that semester when unchecking
   * else if the semester isn't selected then add the classes in that semester
   * we use a set to ensure that the classes array only has unique values
   * @param semester
   */
  const handleSemesterChange = (semester: Semester) => {
    if (isSemSelected(semester)) {
      setClasses((classes) =>
        classes.filter((item) => !Object.values(semester).includes(item))
      );
    } else {
      setClasses((classes) => [
        ...new Set([...classes, ...Object.values(semester)]),
      ]);
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////

  onMount(async () => {
    const [{ result }] = await browser.scripting.executeScript({
      target: { tabId: (await getCurrentTab()).id ?? 0 },
      func: getStudentData,
      // @ts-ignore
      world: "MAIN",
    });
    console.log(result);

    /**
     * This is the data returned from the script, it is the student data...
     * as a result we can set our course and default classes
     */

    const course = Object.entries(result).map(([name, item], index) => [
      name,
      { semester: item as Semester, visible: index === 0 },
    ]);
    setCourse(Object.fromEntries(course));

    if (typeof course[0][1] === "object") {
      setClasses(Object.values(course[0][1].semester));
    }
    setCaptureState("IDLE");
  });

  return (
    <div class="group dark:bg-neutral-800 dark:text-white w-[14rem] flex flex-col ">
      <Show when={captureState() === "CAPTURING"}>
        <div class="flex items-center justify-center w-full z-10 h-[17rem] absolute text-sm text-center font-medium px-2">
          Capturing your timetable data...
        </div>
      </Show>
      <div
        class={`space-y-2 p-2 h-[17rem] overflow-y-scroll scrollbar group-hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500/80 ${
          captureState() === "CAPTURING" ? "opacity-5" : ""
        }`}
      >
        <For each={Object.entries(course())}>
          {([semester_name, semester]) => (
            <div class="border-b last:border-b-0 dark:border-neutral-600 pb-2">
              <div class="flex flex-row  p-1 px-2 justify-between ">
                <div class="flex flex-row items-center gap-2">
                  <button
                    class="inline-flex gap-1 items-center font-medium text-sm"
                    onClick={() => toggleVisiblity(semester_name)}
                  >
                    <Show
                      when={semester.visible}
                      fallback={<ChevronUp class=" size-4" />}
                    >
                      <ChevronDown class=" size-4" />
                    </Show>
                    {semester_name}
                  </button>
                </div>
                <input
                  type="checkbox"
                  name="semester"
                  value={semester_name}
                  id={`semester_${semester_name}`}
                  checked={isSemSelected(semester.semester)}
                  onChange={() => handleSemesterChange(semester.semester)}
                />
              </div>
              <Show when={semester.visible}>
                <ClassList
                  semester={semester.semester}
                  classes={classes}
                  setClasses={setClasses}
                />
              </Show>
            </div>
          )}
        </For>
      </div>
      <button
        class="w-24 m-0.5 place-self-center min-h-7  bg-yellow-400 text-yellow-800 px-2 rounded-md hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed
        "
        disabled={captureState() === "CAPTURING"}
        onClick={async () => {
          setCaptureState("CAPTURING");
          const [{ result }] = await browser.scripting.executeScript({
            target: { tabId: (await getCurrentTab()).id ?? 0 },
            func: capture,
            // @ts-ignore
            world: "MAIN",
            args: [classes()],
          });
          /**
           * This data will be returned from the capture function, we then encoded and open a new window
           */
          const encoded = encodeURIComponent(
            JSONCrush.crush(JSON.stringify(result))
          );
          window
            .open(`https://planmytimetable.vercel.app/?state=${encoded}`)
            ?.focus();
        }}
      >
        Capture
      </button>
    </div>
  );
}

interface classListProps {
  semester: Semester;
  classes: Accessor<Subject[]>;
  setClasses: Setter<Subject[]>;
}
const ClassList = ({ semester, classes, setClasses }: classListProps) => {
  /**
   * method to remove and add item from classes array
   * if already in array find index and remove
   * else add it to classes array
   * @param item - the item to remove/add
   */
  const handleClassesUpdate = (item: Subject) => {
    if (classes().includes(item)) {
      const index = classes().findIndex((value) => value === item);
      setClasses((classes) => classes.toSpliced(index, 1));
    } else {
      setClasses((classes) => [...classes, item]);
    }
  };
  return (
    <ul class=" list-none list-inside px-2">
      <For each={Object.values(semester)}>
        {(item) => (
          <li class="text-xs inline-flex gap-2">
            <input
              type="checkbox"
              name="semester"
              value={item.callista_code}
              id={`class_${item.callista_code}`}
              checked={classes().includes(item)}
              onChange={() => handleClassesUpdate(item)}
            />
            {item.description} ({item.callista_code})
          </li>
        )}
      </For>
    </ul>
  );
};

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
