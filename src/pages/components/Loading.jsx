/* eslint-disable react/prop-types */

function Loading({size, center=''}) {
    return (
        <div style={{width: size, height: size}} className={'loading '+center}>
        </div>
    )
}

export default Loading;