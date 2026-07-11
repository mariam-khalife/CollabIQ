import Sidebar from "./Sidebar";
import Navbar from "./Navbar";


export default function Layout({children}){

return(

<div className="flex min-h-screen bg-[#F8FAFC]">

<Sidebar />


<main className="flex-1">

<Navbar />


{children}


</main>


</div>

)

}