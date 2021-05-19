const markup = (
  link,
  toSite = 'Link verification',
  text = 'Подтвердите свой email',
) => {
  return `<body style="margin:0;padding:0;">
  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
    <tr>
      <td align="center" style="padding:0;">
        <table role="presentation"
          style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
          <tr>
            <td align="center" style="padding:40px 0 30px 0;background:#70bbd9;">
              <img src="https://cdn.pixabay.com/photo/2017/02/08/08/38/mail-2048128_960_720.png" alt="" width="300"
                style="height:auto;display:block;" />
            </td>
          </tr>
          <tr>
            <td style="padding:36px 30px 42px 30px;">
              <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                <tr>
                  <td style="padding:0 0 36px 0;color:#153643;">
                    <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">${text}</h1>
                 
                    <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a
                        href="${link}" style="color:#ee4c50;text-decoration:underline;">${toSite}</a></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;">
                    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                      <tr>
                       
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;background:#ee4c50;">
              <table role="presentation"
                style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                <tr>
                  <td style="padding:0;width:50%;" align="left">
                    <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                      &reg; Тестовое задание, Одесса, Украина.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>`;
};

module.exports = markup;
