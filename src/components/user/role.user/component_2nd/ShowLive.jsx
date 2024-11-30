import { API_SERVER, DOMAIN_SERVER } from "../../../../router/router.server";
import "../../../../styles/css/user/show.live.css";

const ShowLiveJSX = ({ stream }) => {    

    if(!stream || (!stream.id && !stream.creator_id && !stream.users)){
        return(
            <span>Chọn LIVE phía bên trái để bắt đầu xem</span>
        )
    }

    let bgImage = '';
    if(stream.id){
        bgImage = stream?.thumbnails.users.avatar;
    } else if(stream.creator_id){
        bgImage = stream.avatar;
    } else {
        bgImage = stream.users.avatar;
    }

    return(
        <div 
            className="wrap-container show-live"
            style={{
                "--background-image-url": `url(${
                    bgImage?
                    bgImage.startsWith('http')?
                    `${bgImage}`:
                    `${DOMAIN_SERVER}/${bgImage}`:
                    `${API_SERVER.DEFAULT_AVATAR}`
                })`
            }}
        >
            <div className="container-content-live show-live">
                {/* <iframe src="https://www.youtube.com/embed/vrcjoqeLeJI?si=X6zwVXqYhTe3KwLa&amp;start=10" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}
                <iframe src='https://demo.nanocosmos.de/nanoplayer/embed/1.3.3/nanoplayer.html?group.id=452d1ddc-4d4b-41ea-bd72-cf4eed6801d1' frameBorder={0} autoPlay muted />
            </div>
        </div>
    )
}

export default ShowLiveJSX;