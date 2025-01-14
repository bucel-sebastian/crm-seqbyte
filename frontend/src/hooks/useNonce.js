import { useEffect, useState } from "react";

function useNonce() {
    const [nonce, setNonce] = useState(null);

    useEffect(()=> {
        async function fetchNonce() {
            try{
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/security/nonce`);
                const data = await response.json();
                console.log(data);
                setNonce(data.nonce);
            } catch (error) {
                console.error("Error fetching nonce: ",error);
            }
        }

        if(nonce === null) fetchNonce();
    },[nonce]);

    return nonce;
}

export default useNonce