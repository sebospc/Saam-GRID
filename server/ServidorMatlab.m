t = tcpip('0.0.0.0', 30000, 'NetworkRole', 'server');
fopen(t);
data = 1;
value = {};
while data ~= 100
    if t.BytesAvailable ~= 0
        data = native2unicode(fread(t, t.BytesAvailable),'UTF-8');
        value = jsonencode(data);
        disp(1)
        disp(value)
    end
end
    