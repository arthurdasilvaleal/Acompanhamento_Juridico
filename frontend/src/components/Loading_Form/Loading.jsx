import { Loading_Submit, LoadingOverlay } from "./style"
import { PuffLoader } from "react-spinners"
import ReactDOM from 'react-dom'

export default function Loading({ setDOM }){

    if(setDOM == null){
        return(
            <Loading_Submit>
                <PuffLoader color="#CDAF6F"  size={70}/>
            </Loading_Submit>
        )
    }
    else{
        return ReactDOM.createPortal(
            <LoadingOverlay>
                <Loading_Submit>
                    <PuffLoader color="#CDAF6F"  size={70}/>
                </Loading_Submit>
            </LoadingOverlay> ,document.body)
    }
    
}