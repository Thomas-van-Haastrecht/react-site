const TimeInput = ({label, value, onChange=()=>{}, onBlur=()=>{}, step='1', id, placeholder}) => {
    return (
        <div className="input-group mx-sm-3 mb-2">
            <div className="input-group-prepend input-group-text form-begin-tag">{label}</div>
            <input className="form-control"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                type="time"
                step={step}
                id={id}
                placeholder={placeholder}
            />
        </div>
    )
}

export default TimeInput;