const TextArea = ({label, value, rows='3', onChange, onBlur, id, placeholder}) => {
    return (
        <div className="input-group mx-sm-3 mb-2">
            <div className="input-group-prepend input-group-text form-begin-tag">{label}</div>
            <textarea className="form-control"
                value={value}
                rows={rows}
                onChange={onChange}
                onBlur={onBlur}
                type="text"
                id={id}
                placeholder={placeholder}
            />
        </div>
    )
}

export default TextArea;