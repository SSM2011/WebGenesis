import prisma from "@/lib/prisma";

export default async function page(){

  const users = await prisma.post.findMany();

  return (
    <>
    <div>
      {JSON.stringify(users,null, 2)}
    </div>
    </>
  )
}