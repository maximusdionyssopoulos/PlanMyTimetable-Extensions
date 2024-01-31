export default defineUnlistedScript({
  main() {
    window.postMessage(
      {
        from: "msg.js",
        data: window.data.student.student_enrolment_sem,
        // data: "test",
      },
      "*"
    );
  },
});
