import { createEffect, createSignal, onMount, For, Show } from "solid-js";
import { ChevronDown, ChevronUp } from "lucide-solid";

type CourseStructure = Record<string, { semester: Semester; visible: boolean }>;

function App() {
  const [count, setCount] = createSignal<CourseStructure>({});

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

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.id === browser.runtime.id) {
      const course = Object.entries(message).map(([name, item]) => [
        name,
        { semester: item, visible: true },
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
    <div class="group">
      <div class=" w-[14rem] h-[17rem] p-2 dark:bg-neutral-800 dark:text-white space-y-2 overflow-y-scroll scrollbar group-hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500/80">
        <For each={Object.entries(count())}>
          {([semester_name, semester]) => (
            <>
              <div class="flex flex-row border p-1 px-2 rounded-md dark:border-neutral-600 justify-between">
                <fieldset class="flex flex-row items-center gap-2">
                  <input
                    type="checkbox"
                    name="semester"
                    value={semester_name}
                    id={`semester_${semester_name}`}
                  />
                  <label
                    for={`semester_${semester_name}`}
                    class=" font-medium text-sm"
                  >
                    {semester_name}
                  </label>
                </fieldset>
                <button onClick={() => toggleVisiblity(semester_name)}>
                  <ChevronDown class=" size-4 " />
                </button>
              </div>
              <Show when={semester.visible}>
                <ClassList semester={semester.semester} />
              </Show>
            </>
          )}
        </For>
      </div>
      <div class="p-2 overflow-y-hidden dark:bg-neutral-700 dark:text-white border-t dark:border-t-neutral-500">
        <h1 class="font-medium text-sm">PlanMyTimetable Capture</h1>
      </div>
    </div>
  );
}

interface classListProps {
  semester: Semester;
}
const ClassList = ({ semester }: classListProps) => (
  <ul>
    {Object.values(semester).map((class_item) => (
      <li class="text-xs">
        {class_item.description} - {class_item.callista_code}
      </li>
    ))}
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
