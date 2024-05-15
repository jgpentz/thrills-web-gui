## Build Frontend

npm run build

put files from `./build` to `/var/www/thrills-web-gui`

## NGINX config

Put a file `/etc/nginx/sites-available/thrills-web-gui`, where we store all nginx configs, even sites that are disabled

its contents are 

```conf
server {
    listen 80;

    location / {
        alias /var/www/thrills-web-gui/;
        index index.html;
    }

    error_log /var/log/nginx/thrills-web-gui-error.log warn;
    access_log /var/log/nginx/thrills-web-gui-access.log;

}
```

symlink it to `/etc/nginx/sites-enabled/thrills-web-gui`, which is what sites nginx will enable

test config and restart NGINX

```bash
nginx -t
systemctl restart nginx
```
