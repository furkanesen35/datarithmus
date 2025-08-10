// packages/client/app/pages/HomePage.tsx
import Header from 'app/components/Header';
import FirstContainer from '../components/HomeComponents/FirstContainer';
import SecondContainer from 'app/components/HomeComponents/SecondContainer';
import ThirdContainer from 'app/components/HomeComponents/ThirdContainer';

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
