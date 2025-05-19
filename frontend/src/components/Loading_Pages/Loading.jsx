import { HashLoader } from 'react-spinners'
import { LoadingStyle } from './style'

export default function Loading(){
    return(
    <LoadingStyle>
        <HashLoader color="#CDAF6F" size={50} />
        {/* <p style={{ color: '#fff', marginTop: '1rem' }}>Carregando sistema...</p> */}
    </LoadingStyle>
    )
}