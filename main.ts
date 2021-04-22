import hbs from 'handlebars'
import fs from 'fs/promises'

enum EMAIL_TEMPLATE {
  WELCOME='Welcome',
  ACCOUNT_VERIFICATION = 'Account-Verification',
  FORGOT_PASSWORD = 'Forgot-Password',
  NOTARIZATION_REQUEST = 'Notarization-Request',
  APPROVAL_GRANTED = 'Approval-Granted',
  APPROVAL_DENIED = 'Approval-Denied',
}



(async function () {
        const myArgs = process.argv.slice(2);

        const emailtmpl= <EMAIL_TEMPLATE>myArgs[1]

  if(!emailtmpl) throw Error ('Please choose a template')

  const configPath = `./config/${emailtmpl.toLowerCase()}.json`

  try {
    await fs.access(configPath);
  } catch (e) {
    throw Error('Template Config not found!')
  }

    const source = await fs.readFile('./index.hbs')
    const rawSettingData =  await fs.readFile(configPath);
    const rawConfigData =  await fs.readFile(`./config/base.json`);
    const parameters = {
      ...JSON.parse(rawConfigData.toString()),
      ...JSON.parse(rawSettingData.toString())
    }


    const template = hbs.compile(source.toString());

    const content = template(parameters)

       await fs.writeFile(`./templates/${emailtmpl}.html`, content)
})();