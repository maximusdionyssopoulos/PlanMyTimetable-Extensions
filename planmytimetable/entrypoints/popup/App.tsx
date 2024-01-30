import { createEffect, createSignal, onMount } from "solid-js";
// const isolated = () => {
//   const handleFromWeb = async (event: MessageEvent) => {
//     if (event.data.from === "msg.js") {
//       const data = event.data.data;
//       // browser.runtime.onConnect.addListener(async () => {
//       await browser.runtime.sendMessage(data);
//       // });
//     }
//   };
//   window.addEventListener("message", handleFromWeb);
// };

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

type CourseStructure = Record<string, Semester>;

function App() {
  const [count, setCount] = createSignal<CourseStructure>({});

  const getCurrentTab = async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    return tab;
  };

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    setCount(message);
  });

  createEffect(() => {
    console.log(count());
  });

  onMount(async () => {
    await browser.scripting.executeScript({
      target: { tabId: (await getCurrentTab()).id ?? 0 },
      files: ["/load_world.js"],
    });
  });

  return (
    <>
      <div class=" w-[14rem] h-[17rem] p-2 overflow-y-hidden dark:bg-neutral-800 dark:text-white">
        {Object.entries(count()).map(([semester_name, semester]) => (
          <>
            <fieldset class="flex flex-row items-center border p-1 px-2 gap-2 rounded-md dark:border-neutral-600">
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
            <ClassList semester={semester} open={false} />
          </>
        ))}
      </div>
      <div class="p-2 overflow-y-hidden dark:bg-neutral-700 dark:text-white border-t dark:border-t-neutral-500">
        <h1 class="font-medium text-sm">PlanMyTimetable Capture</h1>
      </div>
    </>
  );
}

interface classListProps {
  semester: Semester;
  open: boolean;
}
function ClassList({ semester, open }: classListProps) {
  return open ? (
    <ul>
      {Object.values(semester).map((class_item) => (
        <li class="text-xs">
          {class_item.description} - {class_item.callista_code}
        </li>
      ))}
    </ul>
  ) : null;
}

export default App;
