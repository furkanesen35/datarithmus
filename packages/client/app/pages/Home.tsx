import FirstContainer from "../components/HomeComponents/FirstContainer";
import ThirdContainer from "../components/HomeComponents/ThirdContainer";


export default function Home() {
  return (
    <div className="w-full h-[100vh] bg-[#301934]">
      <FirstContainer/>
      <ThirdContainer/>
    </div>
  );
}