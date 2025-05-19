
import HomeNav from "@/components/home-nav";
import HomeLayout from "@/components/homeLayout";

export default function Home() {
  return (
    <div className="flex flex-col bg-gray-200">
      <HomeNav />
      <HomeLayout />
    </div>
  );
}
