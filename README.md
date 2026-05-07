only works in places where you can open github codespaces

## setup
1. fork the repo
2. click the green "Code" button above, go to the "Codespaces" tab, and click "Create codespace on main."

## how to use
- wait some minutes for the codespace. it needs some time to setup everything.
- once it's ready, your vless link will be printed right there in terminal tab
![terminal](./docs/screenshot.png)

- copy the link into your v2rayng (or your fav proxy app)

## notes
- github gives you 120 free hours per cpu cores for a month
- so if your codespace has 2 cores, the limit will be 60 hours per month
- remember to stop the codespace when you aren't using it, to save your hours

tested on shecan (free plan). so if you can see any of these ips, it'll work for you. if not, try other datacenters/ISPs:
- 63.141.252.203
- 50.7.5.83
- 63.141.252.203
- 94.130.50.12

## Key details (Ghad0)

· Code built on all files: The project primarily uses Dockerfile (70.8%) and Shell script (29.2%) to set up a containerized V2Ray/Xray server inside the Codespace.
· Purpose: Circumvent internet restrictions (tested on "shecan" – an Iranian filtering bypass service).
· Limitation: Only works if you can access GitHub Codespaces. It does not run on a local machine or regular server.
· Cost: GitHub offers free Codespace hours (e.g., 120 core-hours/month). The script reminds you to stop the Codespace when not in use.


## support the main developer
- [buy me a coffee](https://www.buymeacoffee.com/amiremohamadi)
- eth: `0x5724c38100b2aE3d2547974f46D0f2f49eb2D152`
