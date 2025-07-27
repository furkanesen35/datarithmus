// packages/client/app/pages/HomePage.tsx
import Header from 'app/components/Header';
import FirstContainer from '../components/HomeComponents/FirstContainer';
import ThirdContainer from '../components/HomeComponents/ThirdContainer';
import SecondContainer from 'app/components/HomeComponents/SecondContainer';

export default function HomePage() {
  return (
    <div className="w-full h-[100vh] bg-[#301934]">
      <Header />
      <FirstContainer />
      <SecondContainer />
      <ThirdContainer />
    </div>
  );
}
