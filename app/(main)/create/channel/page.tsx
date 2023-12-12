"use client";
import { Input, Button } from "@nextui-org/react";
import React, { FormEvent } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { channel_categories } from "@/data/categories";
import { useFormStatus } from "react-dom";
import { createChannelID } from "@/lib/createChannelD";
import {create} from '@/actions/channel';
import { useSession } from "next-auth/react";
import {useAbly} from "ably/react"

function SubmitButton({onSubmit}:{onSubmit: (e: FormEvent<Element>) => void}) {
  const { pending } = useFormStatus();

  return (
    <Button onSubmit={onSubmit} type="submit" aria-disabled={pending}>
      Create
    </Button>
  );
}

function CreateChannel() {
  const { data: session } = useSession();
  const [name, setName] = React.useState("");
  const [id, setID] = React.useState("");
  const client = useAbly();
  const channel = client.channels.get(name);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    channel.attach()
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setName(e.target.value);
  }
  
  const createwithEmail = create.bind(null, session?.user?.email)
  
  React.useEffect(() => {
    const id = createChannelID(name);
    setID(id);
  },[name]);
  return (
    <section className="flex flex-col  md:items-center pt-20 px-10  w-full min-h-screen  ">
      <h2 className="text-xl font-bold mb-14">Create a channel</h2>
      <form className="space-y-10 md:w-[500px]" action={createwithEmail}>
        <Input
          value={id}
          isReadOnly={true}
          name="chnl_id"
          variant="faded"
          classNames={{
            inputWrapper:
              "h-[50px] dark:bg-neutral-800 dark:text-[#999] bg-neutral-200 text-[#888]",
            label: "dark:text-white/70 text-black",
          }}
          labelPlacement="inside"
          type="text"
          label="Channel ID"
          placeholder=""
        />
        <Input
          isRequired
          onChange={handleChange}
          name="chnl_name"
          variant="faded"
          classNames={{
            inputWrapper:
              "h-[50px] dark:bg-neutral-800 dark:text-white bg-neutral-200 text-black",
            label: "dark:text-white/70 text-black",
          }}
          labelPlacement="outside"
          type="text"
          label="Channel name"
          placeholder="e.g. Welcomers"
        />
        <Input
          isRequired
          name="chnl_desc"
          variant="faded"
          classNames={{
            inputWrapper:
              "h-[50px] dark:bg-neutral-800 dark:text-white bg-neutral-200 text-black",
            label: "dark:text-white/70 text-black",
          }}
          labelPlacement="outside"
          type="text"
          label="Description"
          placeholder="e.g. Come and say hello!"
        />
        <Autocomplete
          name="category"
          isRequired
          defaultItems={channel_categories}
          label="Category"
          labelPlacement="outside"
          placeholder="e.g. Technology"
          classNames={{
            base: "h-[50px]",
          }}
          variant="faded"
        >
          {(category) => (
            <AutocompleteItem key={category.label} value={category.value}>
              {category.label}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <SubmitButton onSubmit={handleSubmit}/>
      </form>
    </section>
  );
}

export default CreateChannel;
