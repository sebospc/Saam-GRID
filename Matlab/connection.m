pythonCon = tcpip('0.0.0.0', 30003,'NetworkRole','Server');
fopen(pythonCon);
demoCooler2 = fullfile("DemoCooler2.m");
while true
    if pythonCon.BytesAvailable ~= 0
        data = char(fread(pythonCon, pythonCon.BytesAvailable));
        if data == "1"
            run(demoCooler2);
            pythonCon = tcpip('0.0.0.0', 30003,'NetworkRole','Server');
            fopen(pythonCon);
        elseif data == "0"
            break;
        end
    end
end
fclose(t);
