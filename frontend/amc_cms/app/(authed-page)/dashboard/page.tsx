import PageViewsChart from "@/components/dashboard/PageViewsChart";
import PageTopViewsChart from "@/components/dashboard/PageTopViewsChart";
import ContactInfomation from "@/components/dashboard/ContactInfomation";
import ChannelPieChart from "@/components/dashboard/ChannelPieChart";
import LocationMap from "@/components/dashboard/LocationMap";

export default function Page() {
  return (
    <>
      <div className="mb-8">
        <ContactInfomation />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
        <PageViewsChart />
        <ChannelPieChart />
      </div>
      <div className="mb-8">
        <PageTopViewsChart />
      </div>
      <LocationMap />
    </>
  );
}
