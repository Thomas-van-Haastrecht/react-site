const PriceInput = ({label, value, onChange=()=>{}, onBlur=()=>{}, id, placeholder}) => {
    return (
        <div className="input-group mx-sm-3 mb-2">
            <div className="input-group-prepend input-group-text form-begin-tag">{label}</div>
            <div className="input-group-prepend input-group-text bg-white">€</div>
            <input className="form-control border-left-0"
                value={value}
                pattern="^\d*(,\d\d?)?$"
                onChange={onChange}
                onBlur={onBlur}
                type="text"
                id={id}
                placeholder={placeholder}
            />
        </div>
    )
}

export default PriceInput;