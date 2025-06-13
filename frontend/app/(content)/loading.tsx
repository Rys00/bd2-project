import Loader from "@/components/ui/loader.component";

const Loading = () => {
  return (
    <div className="w-full min-h-[100vh] flex flex-col justify-center">
      <div className="flex w-full justify-center">
        <Loader />
      </div>
    </div>
  );
};

export default Loading;
