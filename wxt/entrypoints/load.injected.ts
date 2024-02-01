export default defineUnlistedScript({
  main() {
    window.postMessage(
      {
        from: "PlanMyTimetableCapture_",
        next: "CAPTURE",
        // @ts-ignore
        data: window.data.student.student_enrolment_sem,
      },
      "*"
    );
  },
});
