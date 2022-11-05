import Image from "next/image";
import Link from "next/link";


function Icon({ width, height}) {
    return (
        <div className="logo-container">
            <Link href="/"><Image src="/logo.png" className="logo" width={width} height={height} alt="website icon" /></Link>
        </div>
    )
}

export default Icon;