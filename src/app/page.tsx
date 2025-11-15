
import HomeNav from "@/components/home-nav";
import HomeLayout from "@/components/mylayouts/homeLayout";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HomeNav />
      <HomeLayout />
    </div>
  );
}
