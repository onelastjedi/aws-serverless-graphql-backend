var UserPoolId = process.env.UserPoolId;
exports.handler = (event, context) => {
  if (event.userPoolId === UserPoolId) {
    if (event.triggerSource === 'CustomMessage_AdminCreateUser') {
      var appUrl = `${process.env.AppUrl}/${process.env.ChangePasswordRoute}?email=${event.request.usernameParameter}&temporary=${event.request.codeParameter}`;

      var message = `<html>
        <p>Dear ${event.request.userAttributes['custom:name']}, </p>

        <p>We've created a new account for you on the DHC App.</p>

        <p>Please follow the <a href='${appUrl}'>${appUrl}</a>
        <br> to login and create your new password.</p>

        <p>Please, note that you will need to create a new, custom password
        <br> immediatly after you login to the DHC App.

        <p>This should be a password that only you know and <br>
        should not be shared with anyone else.</p>

        <p>We also recommend that you allow the DHC App to be saved to your device <br>
        so that you can access it in the future directly from the DHC App icon on your device's desktop.</p>

        <p>User ID: ${event.request.usernameParameter}<br>
        DHC App Link: ${process.env.AppUrl}</p>

        <p>If your need support or have any questions, please reply to this email <br>
        or call the DHC Support Desk at <a href="tel:713-352-7282">713-352-7282</a> (Option 1).</p>

        <p>Thank you and welcome to DHC!</p>
        <small><font color="#666666">DHC App Team</font></small>
      </html>`;

      event.response.emailSubject = 'Welcome to DHC!';
      event.response.emailMessage = message;
    }

    if (event.triggerSource === 'CustomMessage_ForgotPassword') {
      var appUrl = `${process.env.AppUrl}/${process.env.ResetPasswordRoute}?email=${event.request.userAttributes.email}&code=${event.request.codeParameter}`;

      var message = `<html>
        <p>Dear ${event.request.userAttributes['custom:name']}, </p>

        <p>This message is in response to your request to reset your password on the DHC App.</p>

        <p>If you did not make this request, please delete this message <br>
        or you can reply to let us know it has reached the wrong person.</p>

        <p>Please, follow the <a href='${appUrl}'>${appUrl}</a>
        <br> to login and create your new password.</p>

        <p>You will need to create a new, custom password <br>
        immediately after you log in with the temporary link above.</p>

        <p>Please don't hesitate to contact us by replying to <br>
        this email (<a href="mailto: support@dataharmonix.com">support@dataharmonix.com</a>), or <br>
        by calling us on <a href="tel:713-352-7282">713-352-7282</a> (Option 2).</p>

        <p>Thank you.</p>
        <small><font color="#666666">DHC Support Team</font></small>
      </html>`;

      event.response.emailSubject = 'Reset password on DHC App';
      event.response.emailMessage = message;
    }
  }

  context.done(null, event);
};