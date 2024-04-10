const TextInput = ({label, value, onChange=()=>{}, onBlur=()=>{}, id, placeholder}) => {
    return (
        <div className="input-group mx-sm-3 mb-2">
            <div className="input-group-prepend input-group-text form-begin-tag">{label}</div>
            <input className="form-control"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                type="text"
                id={id}
                placeholder={placeholder}
            />
        </div>
    )
}

export default TextInput;