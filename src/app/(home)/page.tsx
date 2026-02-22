"use client"

import Image from "next/image";
import "../../../public/logo.svg"
import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/projects-list";

const Page = () => {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image src="logo.svg" alt="WebGenesis" width={165} height={165} className="hidden md:block"/>
        </div>
        <h1 className="text-2xl md:text-5xl font-bold text-center">
          Where Vision Becomes Software
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center">
          Build the future without friction 
        </p>
        <p className="text-lg md:text-xl text-muted-foreground text-center">
           An intelligent platform engineered for ambitious creators 
        </p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>
      <ProjectsList />
    </div>
  )
}

export default Page;
