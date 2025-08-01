import SubmissionActivity from "./SubmissionActivity";
import { SubmissionActivityList } from "./SubmissionActivityList";

export const Submissions = () => {
  return (
    <div className="grid-container grid grid-cols-12">
      <div className="item-1 col-span-8 m-1">
        <SubmissionActivityList />
      </div>
      <div className="item-2 col-span-4 m-1">
        <SubmissionActivity />
      </div>
    </div>
  );
};
