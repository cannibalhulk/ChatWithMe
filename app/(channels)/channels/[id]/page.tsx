import ChannelView from "@/components/client/ChannelView";
import { TChannel } from "@/components/client/ChannelsView";
import { Metadata } from "next";
import { FC } from "react";

export async function generateMetadata({params}: {params: {id:string}}) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/channels?id=${params.id}`);
  const data: TChannel = await res.json();
    return {
        title: `${data.chnl_name}`,
        description: `${data.chnl_desc}`,
        creator: `${data.createdBy}`,
        keywords: `${data.category}`,
    } as Metadata
}
interface PageProps {
    params:{
      id: string
    }
}

export async function generateStaticParams() {
  /**
       * need to include 'NEXTAUTH_URL` env variable here as it is a server component
       */
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/channels`);
  const data: TChannel[] = await res.json();
  return data.map((channel) => ({
    id: channel._id
  }));
}

const Page: FC<PageProps> = ({params}) => {
  return (
    <main className="pt-4 w-4/5 min-h-screen">
      <section className="flex flex-col mt-15">
        <ChannelView params={params}/>
      </section>
    </main>
  );
};

export default Page;
