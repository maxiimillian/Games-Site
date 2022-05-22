import Image from "next/image";
import Link from "next/link";


function Icon() {
    return (
        <div className="logo-container">
            <Link href="/"><Image src="/logo.png" className="logo" width="100%" height="100%" alt="website icon" /></Link>
        </div>
    )
}

export default Icon;