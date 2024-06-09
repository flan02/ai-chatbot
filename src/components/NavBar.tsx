
import Link from "next/link"
import { Button } from "./ui/button"



type Props = {

}

const NavBar = (props: Props) => {

  return (
    <header className="w-full text-center py-4 bg-amber-300 text-black font-bold">
      <Button className="bg-[#131414] hover:bg-[#0d0e4e] text-amber-50">
        <Link href="/about"> About me </Link>
      </Button>
    </header>
  )
}

export default NavBar

