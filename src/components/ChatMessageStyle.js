export default ({ palette, spacing }) => {
    const radius = spacing(2.5);
    const size = spacing(5);
    const marginRightReverse = spacing(-5);
    const rightBgColor = palette.secondary.main;
    const leftBgColor = palette.secondary.light;
    // if you want the same as facebook messenger, use this color '#09f'
    return {
      avatar: {
        width: '30px',
        height: '30px',
      },
      leftRow: {
        textAlign: 'left',
      },
      rightRow: {
        textAlign: 'right',
      },
      msg: {
        padding: spacing(1, 2),
        borderRadius: 4,
        marginBottom: 4,
        display: 'inline-block',
        wordBreak: 'break-word',
        fontFamily:
          // eslint-disable-next-line max-len
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        fontSize: '14px',
      },
      left: {
        borderTopRightRadius: radius,
        borderBottomRightRadius: radius,
        backgroundColor: leftBgColor,
        color: palette.common.black,
      },
      right: {
        borderTopLeftRadius: radius,
        borderBottomLeftRadius: radius,
        backgroundColor: rightBgColor,
        color: palette.common.white,
      },
      leftFirst: {
        borderTopLeftRadius: radius,
      },
      leftLast: {
        borderBottomLeftRadius: radius,
      },
      rightFirst: {
        borderTopRightRadius: radius,
      },
      rightLast: {
        borderBottomRightRadius: radius,
      },
    };
  };