import GoogleAuth2Redirect from "@/app/(BeforeLogin)/_component/googleAuth2Redirect";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-10">
        <span className="loader"></span>
      </div>
      <GoogleAuth2Redirect />
    </>
  );
}
