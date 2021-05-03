## Service

1. Create service: `sudo nano /etc/systemd/system/rpiManagerServer.service`
	
	Content:
	```sh
	[Unit]
	Description="Raspberry PI manager server"

	[Service]
	ExecStart=sudo python3 api.py
	WorkingDirectory=/path/to/server/folder
	Restart=always
	RestartSec=10
	StandardOutput=syslog
	StandardError=syslog
	SyslogIdentifier=RPISettingsManager

	[Install]
	WantedBy=multi-user.target
	```
2. Start service: `sudo systemctl start rpiManagerServer.service`
3. Enable service on startup: `systemctl enable rpiManagerServer.service`