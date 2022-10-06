/**
 * @param {Object} props
 * @param {ReactElement} props.children
 * @returns {ReactElement}
 */
function Wrapper({ children }) {
    return <div style={{ marginTop: 16, color: "red" }}>{children}</div>;
}

/**
 * @param {Object} props
 * @param {string | string[]} props.errors
 */
export default function FormLevelErrMsg({ errors }) {
    if (!errors || !errors.length) return null;

    if (typeof errors === "string")
        return (
            <Wrapper>
                <>{errors}</>
            </Wrapper>
        );

    if (errors.length === 1)
        return (
            <Wrapper>
                <>{errors[0]}</>
            </Wrapper>
        );

    return (
        <Wrapper>
            <ul>
                {errors.map((error, key) => (
                    <li key={key}>{error}</li>
                ))}
            </ul>
        </Wrapper>
    );
}

FormLevelErrMsg.displayName = "FormLevelErrMsg";
