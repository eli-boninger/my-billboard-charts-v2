interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className: string;
  children: React.ReactNode;
}

export const ButtonBase = (props: Props) => {
  const { className, children, ...otherProps } = props;
  return (
    <button
      className={`border border-solid rounded p-2 w-fit ${className}`}
      {...otherProps}
    >
      {children}
    </button>
  );
};
``;
