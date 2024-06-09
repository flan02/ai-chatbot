import Link from "next/link"



type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <h1>
        Creator page

      </h1>
      <Link href="/">home</Link>
    </div>
  )
}

export default page