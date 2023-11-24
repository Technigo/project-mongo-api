// eslint-disable-next-line react/prop-types
export const Songs = ({title, artist}) => {
    return(
        <div className="card">
            <h2>{title}</h2>
            <p>{artist}</p>
        </div>
    )
}