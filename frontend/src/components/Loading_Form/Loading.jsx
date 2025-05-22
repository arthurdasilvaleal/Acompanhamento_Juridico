import { Loading_Submit } from "./style"
import { PuffLoader } from "react-spinners"

export default function Loading(){

    return(
        <Loading_Submit>
            <PuffLoader color="#CDAF6F"  size={70}/>
        </Loading_Submit>
    )
}