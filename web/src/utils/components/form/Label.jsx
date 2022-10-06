/**
 * FormLabel.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.label
 * @param {string} props.className
 * @param {boolean} props.required
 */
export default function Label({ name = "", label, className = "", required }) {
    if (!label) return null;
    return (
        <div style={{ marginBottom: 5 }}>
            <label htmlFor={name} className={(required ? "red-dot " : " ") + className}>
                {label}
            </label>
        </div>
    );
}
