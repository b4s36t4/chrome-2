Hi, there.!

# Extension Use Cases

First thing to discuss is that this extension will create google meet links using the google accounts already Signed In.

So, let's say to create a new meet we have a simple link which later will be converted to full google meet url.

Default New Meet URL is https://meet.google.com/new Which let's user to create new meet easily.

By using these I have implemented a way to quickly create google meet.

The extension also support multi-sign in Version, which let's user to choose the email which will be used to create meets later.

# Usage & Installations

- If you have git Just pull/clone the github Repo from here https://github.com/b4s36t4/chrome-2
- if no git installed please install it from https://git-scm.com and then try pull/clone the branch again.
- Once the cloning of the repo is done, run this command from the root folder of the cloned projects
- Command is `yarn install` or `npm install` which automatically install the pacakges need for the extension to work.
- Once that's done you can either use the extension in development or production mode.

## Running in the production Mode

It's Just as simple as running all other node projects, just by running command

`yarn start` or `npm start`

Once that's done, you can able to see a new folder called `build` in the root source of the code which will contain all the things that needed extension to work.

You need to upload to the chrome in-order to test or use which can be done by enabling developer mode in chrome settings.

    * Navigate to chrome://extensions or brave://extensions or edge://extensions based on the browser you use.
    * There you can see a toggle switch which will turn-on developer mode.
    * once the developer mode is turned on, you can upload the un-packed version (not .crx file) code which in this case is build folder that previously created while running the `yarn start`.
    * Click on Upload Unpacked and select the build folder appropritate to your file-system.
    * That's it you can see the extension in your address bar, Enjoy :)

## Running in the Production Mode.

    * As stated in the above you need to enable the developer mode to install the extension, so be sure to read the above points to get the context of enable the chrome developer mode for extensions.
    * Once the extensions developer mode is done, it's time to create the extension in the production mode.
    * To do that, we need to run a command `yarn build` or `npm build` which will build the production version of the extension and can appear in the build folder.
    * Upload it as Un-Packed extension to enjoy the exntesion :)

## Approach I've choosen.

Well, there are 2 types of approach that I got to work with.

One is using the default identity given by chrome ecosystem to login with the current chrome logged in user and use the google api's to create a calendar event with including the google meet in it.

By using there are some drawbacks

    * Can not able to use the extensions except on chrome (not evne chrome powered browsers like brave, edge etc)
    * And we need to authniticate the user manaullly and need to check for the token expiration (ways are there to avoid this)
    * And no more support of multiple accounts usage, because the login method chrome is prodviding under the chrome.identity is Just the user who enabled the profile sync with the chrome, not logged in google products in chrome.
    which makes it harder to use multiple accounts.

So based on the above issues, I've choose another approach which is like a bit of scraping but by using chrome exnteions.

There are several parts of chrome extension things comes very handy at problems like this one I'm getting.

So the basic approach of the 2nd method is Just simply store the mail and index of the account that the user logged in by navigating user manually to the follwing link

https://accounts.google.com/accountchooser/

which will display the mail that are logged in (logged out also) with their index as sorted.

Saving all the mails and it's index's I can able to create a new meet using the following template url
https://meet.google.com/new?authuser=0 => 0 is the index of the account.

To Know the status of the meet link, that is activated or not I'm using webNavigator which is the another cool thing available on chrome extension pack.

That's it. Thanks for reading.

## Creating Meet.

Meet can be created using 2 ways.

> You can easily create meeting using the chrome extension popu=-up extension menu.

> There's a shortcut which can activate the chrome extension in a new window and start the meet where it will  
> automatically copy the meet url to your clipboard. The shortcut key is `Command+Shift+1` for mac and for other
> systems it will be `Ctrl+Shift+1`

For the 1st method you can copy the meet url by clicking on the copy button appearing on the popup once the meet is created and opened.

For the 2nd method link automatically created and added to your clipboard.
