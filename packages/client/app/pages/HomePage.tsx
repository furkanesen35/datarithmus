import Header from "app/components/Header";
import FirstContainer from "../components/HomeComponents/FirstContainer";
import ThirdContainer from "../components/HomeComponents/ThirdContainer";

export default function HomePage() {
  return (
    <div className="w-full h-[100vh] bg-[#301934]">
      <Header/>
      <FirstContainer />
      <ThirdContainer />
    </div>
  );
}