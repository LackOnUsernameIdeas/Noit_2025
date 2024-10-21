import { FC, Fragment } from "react";

interface Test {}

const Test: FC<Test> = () => {
  return (
    <Fragment>
      <div className="flex flex-col items-center justify-start min-h-screen pt-80 page-header-breadcrumb">
        <div className="grid grid-cols-12 gap-6">
          <div className="xl:col-span-6 col-span-12">
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput" className="form-label">
                На кои жанрове най-много се наслаждавате?
              </label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                placeholder="Пример: хорър, екшън, криминален"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                Как се чувствате в момента?
              </label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput2"
                placeholder="Пример: развълнуван/на, любопитен/на, тъжен/на, изплашен/на"
              />
            </div>
            <div className="ti-btn-list space-x-2 rtl:space-x-reverse mt-4">
              <button
                type="button"
                className={`ti-btn ti-btn-primary-gradient ti-btn-wave`}
                key={1}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Test;
