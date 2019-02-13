function [Equaliser_values,Equaliser_ranges]=FindEqualiser_values(Characteristic,Domaines,Desirability_limits,Design_variables_values)

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%   Function FindEqualiser_values for portable cooler design
%
%   Inputs  
%
%   Outputs     Equaliser_values,
%               Equaliser_ranges
%
%   Programmed by:  David Ríos-Zapata
%                   drioszap@eafit.edu.co
%
%   Version:    01 // 16.07.2018
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

syms th_A_var th_B_var th_C_var L_C_var H_C_var W_C_var th_lid_var 

% Unpacking of desirability values
Pr1_minAC=Desirability_limits(1,1);
Pr1_minOk=Desirability_limits(1,2);
Pr1_aclevel=Desirability_limits(1,3);
Pr1_maxOK=Desirability_limits(1,4);


Pr2_minAC=Desirability_limits(2,1);
Pr2_minOk=Desirability_limits(2,2);
Pr2_aclevel=Desirability_limits(2,3);
Pr2_maxOK=Desirability_limits(2,4);

Pr3_minAC=Desirability_limits(3,1);
Pr3_minOk=Desirability_limits(3,2);
Pr3_aclevel=Desirability_limits(3,3);
Pr3_maxOK=Desirability_limits(3,4);

Pr4_minAC=Desirability_limits(4,1);
Pr4_minOk=Desirability_limits(4,2);
Pr4_aclevel=Desirability_limits(4,3);
Pr4_maxOK=Desirability_limits(4,4);

Pr5_minAC=Desirability_limits(5,1);
Pr5_minOk=Desirability_limits(5,2);
Pr5_aclevel=Desirability_limits(5,3);
Pr5_maxOK=Desirability_limits(5,4);

Pr6_minAC=Desirability_limits(6,1);
Pr6_minOk=Desirability_limits(6,2);
Pr6_aclevel=Desirability_limits(6,3);
Pr6_maxOK=Desirability_limits(6,4);

Pr7_minAC=Desirability_limits(7,1);
Pr7_minOk=Desirability_limits(7,2);
Pr7_aclevel=Desirability_limits(7,3);
Pr7_maxOK=Desirability_limits(7,4);


% Unpack characteristics and external conditions values
T_0_mean=Design_variables_values(1);
T_5_mean=Design_variables_values(2);
th_A_mean=Design_variables_values(3);
K_A_mean=Design_variables_values(4);
th_B_mean=Design_variables_values(5);
K_B_mean=Design_variables_values(6);
th_C_mean=Design_variables_values(7);
K_C_mean=Design_variables_values(8);
M_mean=Design_variables_values(9);
Cp_mean=Design_variables_values(10);
t_mean=Design_variables_values(11);
m_user_mean=Design_variables_values(12);
L_C_mean=Design_variables_values(13);
W_C_mean=Design_variables_values(14);
H_C_mean=Design_variables_values(15);
th_lid_mean=Design_variables_values(16);
rho_A_mean=Design_variables_values(17);
rho_B_mean=Design_variables_values(18);
rho_C_mean=Design_variables_values(19);


% Initialise values
Equaliser_values=zeros(7,25);
Equaliser_ranges=zeros(2,25);
i_values=1;

if (Characteristic=='th_A')    
    
    %th_A: Domaines(3,1)
    
    for (value=Domaines(3,2):-(Domaines(3,2)-Domaines(3,1))/24:Domaines(3,1)) 
        th_A_mean=value;
        
        Design_variables_values=[T_0_mean
        T_5_mean
        th_A_mean
        K_A_mean
        th_B_mean
        K_B_mean
        th_C_mean
        K_C_mean
        M_mean
        Cp_mean
        t_mean
        m_user_mean
        L_C_mean
        W_C_mean
        H_C_mean
        th_lid_mean
        rho_A_mean
        rho_B_mean
        rho_C_mean];

        Design_variables_full=[Design_variables_values];
        [Delta_T_ext,Delta_T_in] = Determine_DeltaT_Cooler(T_0_mean,T_5_mean,th_A_mean,K_A_mean,th_B_mean,K_B_mean,th_C_mean,K_C_mean,L_C_mean,W_C_mean,H_C_mean);

        %Raw variables definition
        Rel1_raw=T_5_mean + exp((2*H_C_mean*t_mean*(L_C_mean + W_C_mean)*(T_0_mean - T_5_mean))/(Cp_mean*M_mean*(5/(28*(Delta_T_in/(H_C_mean*T_5_mean))^(1/4)) + 5/(28*(Delta_T_ext/(H_C_mean*T_0_mean))^(1/4)) + th_A_mean/K_A_mean + th_B_mean/K_B_mean + th_C_mean/K_C_mean)));
        Rel2_raw=(m_user_mean*9.81)*0.5/((2*th_A_mean+2*th_B_mean+2*th_C_mean)*(L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean));
        Rel3_raw=L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean;
        Rel4_raw=W_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean;
        Rel5_raw=H_C_mean+th_C_mean+th_B_mean+th_A_mean+th_lid_mean;
        Rel6_raw=rho_B_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_A_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_C_mean*(H_C_mean*L_C_mean*W_C_mean - (H_C_mean + th_C_mean)*(L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean)) + rho_A_mean*(H_C_mean + th_A_mean + th_B_mean + th_C_mean)*(L_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean) - rho_B_mean*(H_C_mean + th_C_mean)*(L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean);
        Rel7_raw=L_C_mean*W_C_mean*H_C_mean;
        
        
        Equaliser_values(1,i_values)=value;
        Equaliser_values(2,i_values)=[zmf(Rel1_raw,[Pr1_minOk, Pr1_aclevel])];
        Equaliser_values(3,i_values)=[zmf(Rel2_raw,[Pr2_minOk, Pr2_aclevel])];
        Equaliser_values(4,i_values)=[zmf(Rel3_raw,[Pr3_minOk, Pr3_aclevel])];
        Equaliser_values(5,i_values)=[zmf(Rel4_raw,[Pr4_minOk, Pr4_aclevel])];
        Equaliser_values(6,i_values)=[zmf(Rel5_raw,[Pr5_minOk, Pr5_aclevel])];
        Equaliser_values(7,i_values)=[zmf(Rel6_raw,[Pr6_minOk, Pr6_aclevel])];
        Equaliser_values(8,i_values)=[pimf(Rel7_raw,[Pr7_minAC,Pr7_minOk,Pr7_aclevel,Pr7_aclevel])];
        Agg_Des=Equaliser_values(2,i_values)*Equaliser_values(3,i_values)*Equaliser_values(4,i_values)*Equaliser_values(5,i_values)*Equaliser_values(6,i_values)*Equaliser_values(7,i_values)*Equaliser_values(8,i_values);


        Equaliser_ranges(1,i_values)=value;
        Equaliser_ranges(2,i_values)=Agg_Des;


        Val_Pr1=[Rel1_raw-273];
        Val_Pr2=[Rel2_raw];
        Val_Pr3=[Rel3_raw];
        Val_Pr4=[Rel4_raw];
        Val_Pr5=[Rel5_raw];
        Val_Pr6=[Rel6_raw];
        Val_Pr7=[Rel7_raw*1000];
        i_values=i_values+1;
    end
    
elseif (Characteristic=='th_B')
    %th_5: Domaines(5,1)
    
    for (value=Domaines(5,2):-(Domaines(5,2)-Domaines(5,1))/24:Domaines(5,1)) 
        th_B_mean=value;
        
        Design_variables_values=[T_0_mean
        T_5_mean
        th_A_mean
        K_A_mean
        th_B_mean
        K_B_mean
        th_C_mean
        K_C_mean
        M_mean
        Cp_mean
        t_mean
        m_user_mean
        L_C_mean
        W_C_mean
        H_C_mean
        th_lid_mean
        rho_A_mean
        rho_B_mean
        rho_C_mean];

        Design_variables_full=[Design_variables_values];
        [Delta_T_ext,Delta_T_in] = Determine_DeltaT_Cooler(T_0_mean,T_5_mean,th_A_mean,K_A_mean,th_B_mean,K_B_mean,th_C_mean,K_C_mean,L_C_mean,W_C_mean,H_C_mean);

        %Raw variables definition
        Rel1_raw=T_5_mean + exp((2*H_C_mean*t_mean*(L_C_mean + W_C_mean)*(T_0_mean - T_5_mean))/(Cp_mean*M_mean*(5/(28*(Delta_T_in/(H_C_mean*T_5_mean))^(1/4)) + 5/(28*(Delta_T_ext/(H_C_mean*T_0_mean))^(1/4)) + th_A_mean/K_A_mean + th_B_mean/K_B_mean + th_C_mean/K_C_mean)));
        Rel2_raw=(m_user_mean*9.81)*0.5/((2*th_A_mean+2*th_B_mean+2*th_C_mean)*(L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean));
        Rel3_raw=L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean;
        Rel4_raw=W_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean;
        Rel5_raw=H_C_mean+th_C_mean+th_B_mean+th_A_mean+th_lid_mean;
        Rel6_raw=rho_B_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_A_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_C_mean*(H_C_mean*L_C_mean*W_C_mean - (H_C_mean + th_C_mean)*(L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean)) + rho_A_mean*(H_C_mean + th_A_mean + th_B_mean + th_C_mean)*(L_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean) - rho_B_mean*(H_C_mean + th_C_mean)*(L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean);
        Rel7_raw=L_C_mean*W_C_mean*H_C_mean;

        Equaliser_values(1,i_values)=value;
        Equaliser_values(2,i_values)=[zmf(Rel1_raw,[Pr1_minOk, Pr1_aclevel])];
        Equaliser_values(3,i_values)=[zmf(Rel2_raw,[Pr2_minOk, Pr2_aclevel])];
        Equaliser_values(4,i_values)=[zmf(Rel3_raw,[Pr3_minOk, Pr3_aclevel])];
        Equaliser_values(5,i_values)=[zmf(Rel4_raw,[Pr4_minOk, Pr4_aclevel])];
        Equaliser_values(6,i_values)=[zmf(Rel5_raw,[Pr5_minOk, Pr5_aclevel])];
        Equaliser_values(7,i_values)=[zmf(Rel6_raw,[Pr6_minOk, Pr6_aclevel])];
        Equaliser_values(8,i_values)=[pimf(Rel7_raw,[Pr7_minAC,Pr7_minOk,Pr7_aclevel,Pr7_aclevel])];
        Agg_Des=Equaliser_values(2,i_values)*Equaliser_values(3,i_values)*Equaliser_values(4,i_values)*Equaliser_values(5,i_values)*Equaliser_values(6,i_values)*Equaliser_values(7,i_values)*Equaliser_values(8,i_values);


        Equaliser_ranges(1,i_values)=value;
        Equaliser_ranges(2,i_values)=Agg_Des;


        Val_Pr1=[Rel1_raw-273];
        Val_Pr2=[Rel2_raw];
        Val_Pr3=[Rel3_raw];
        Val_Pr4=[Rel4_raw];
        Val_Pr5=[Rel5_raw];
        Val_Pr6=[Rel6_raw];
        Val_Pr7=[Rel7_raw*1000];
        i_values=i_values+1;
    end
    
elseif (Characteristic=='th_C')
    %th_C: Domaines(7,1)
    
    for (value=Domaines(7,2):-(Domaines(7,2)-Domaines(7,1))/24:Domaines(7,1)) 
        th_C_mean=value;
        
        Design_variables_values=[T_0_mean
        T_5_mean
        th_A_mean
        K_A_mean
        th_B_mean
        K_B_mean
        th_C_mean
        K_C_mean
        M_mean
        Cp_mean
        t_mean
        m_user_mean
        L_C_mean
        W_C_mean
        H_C_mean
        th_lid_mean
        rho_A_mean
        rho_B_mean
        rho_C_mean];

        Design_variables_full=[Design_variables_values];
        [Delta_T_ext,Delta_T_in] = Determine_DeltaT_Cooler(T_0_mean,T_5_mean,th_A_mean,K_A_mean,th_B_mean,K_B_mean,th_C_mean,K_C_mean,L_C_mean,W_C_mean,H_C_mean);

        %Raw variables definition
        Rel1_raw=T_5_mean + exp((2*H_C_mean*t_mean*(L_C_mean + W_C_mean)*(T_0_mean - T_5_mean))/(Cp_mean*M_mean*(5/(28*(Delta_T_in/(H_C_mean*T_5_mean))^(1/4)) + 5/(28*(Delta_T_ext/(H_C_mean*T_0_mean))^(1/4)) + th_A_mean/K_A_mean + th_B_mean/K_B_mean + th_C_mean/K_C_mean)));
        Rel2_raw=(m_user_mean*9.81)*0.5/((2*th_A_mean+2*th_B_mean+2*th_C_mean)*(L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean));
        Rel3_raw=L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean;
        Rel4_raw=W_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean;
        Rel5_raw=H_C_mean+th_C_mean+th_B_mean+th_A_mean+th_lid_mean;
        Rel6_raw=rho_B_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_A_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_C_mean*(H_C_mean*L_C_mean*W_C_mean - (H_C_mean + th_C_mean)*(L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean)) + rho_A_mean*(H_C_mean + th_A_mean + th_B_mean + th_C_mean)*(L_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean) - rho_B_mean*(H_C_mean + th_C_mean)*(L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean);
        Rel7_raw=L_C_mean*W_C_mean*H_C_mean;

        Equaliser_values(1,i_values)=value;
        Equaliser_values(2,i_values)=[zmf(Rel1_raw,[Pr1_minOk, Pr1_aclevel])];
        Equaliser_values(3,i_values)=[zmf(Rel2_raw,[Pr2_minOk, Pr2_aclevel])];
        Equaliser_values(4,i_values)=[zmf(Rel3_raw,[Pr3_minOk, Pr3_aclevel])];
        Equaliser_values(5,i_values)=[zmf(Rel4_raw,[Pr4_minOk, Pr4_aclevel])];
        Equaliser_values(6,i_values)=[zmf(Rel5_raw,[Pr5_minOk, Pr5_aclevel])];
        Equaliser_values(7,i_values)=[zmf(Rel6_raw,[Pr6_minOk, Pr6_aclevel])];
        Equaliser_values(8,i_values)=[pimf(Rel7_raw,[Pr7_minAC,Pr7_minOk,Pr7_aclevel,Pr7_aclevel])];
        Agg_Des=Equaliser_values(2,i_values)*Equaliser_values(3,i_values)*Equaliser_values(4,i_values)*Equaliser_values(5,i_values)*Equaliser_values(6,i_values)*Equaliser_values(7,i_values)*Equaliser_values(8,i_values);


        Equaliser_ranges(1,i_values)=value;
        Equaliser_ranges(2,i_values)=Agg_Des;


        Val_Pr1=[Rel1_raw-273];
        Val_Pr2=[Rel2_raw];
        Val_Pr3=[Rel3_raw];
        Val_Pr4=[Rel4_raw];
        Val_Pr5=[Rel5_raw];
        Val_Pr6=[Rel6_raw];
        Val_Pr7=[Rel7_raw*1000];
        i_values=i_values+1;
    end
    
elseif(Characteristic=='L_C_')
    %L_C: Domaines(13,1)
    
    for (value=Domaines(13,2):-(Domaines(13,2)-Domaines(13,1))/24:Domaines(13,1)) 
        L_C_mean=value;
        
        Design_variables_values=[T_0_mean
        T_5_mean
        th_A_mean
        K_A_mean
        th_B_mean
        K_B_mean
        th_C_mean
        K_C_mean
        M_mean
        Cp_mean
        t_mean
        m_user_mean
        L_C_mean
        W_C_mean
        H_C_mean
        th_lid_mean
        rho_A_mean
        rho_B_mean
        rho_C_mean];

        Design_variables_full=[Design_variables_values];
        [Delta_T_ext,Delta_T_in] = Determine_DeltaT_Cooler(T_0_mean,T_5_mean,th_A_mean,K_A_mean,th_B_mean,K_B_mean,th_C_mean,K_C_mean,L_C_mean,W_C_mean,H_C_mean);

        %Raw variables definition
        Rel1_raw=T_5_mean + exp((2*H_C_mean*t_mean*(L_C_mean + W_C_mean)*(T_0_mean - T_5_mean))/(Cp_mean*M_mean*(5/(28*(Delta_T_in/(H_C_mean*T_5_mean))^(1/4)) + 5/(28*(Delta_T_ext/(H_C_mean*T_0_mean))^(1/4)) + th_A_mean/K_A_mean + th_B_mean/K_B_mean + th_C_mean/K_C_mean)));
        Rel2_raw=(m_user_mean*9.81)*0.5/((2*th_A_mean+2*th_B_mean+2*th_C_mean)*(L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean));
        Rel3_raw=L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean;
        Rel4_raw=W_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean;
        Rel5_raw=H_C_mean+th_C_mean+th_B_mean+th_A_mean+th_lid_mean;
        Rel6_raw=rho_B_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_A_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_C_mean*(H_C_mean*L_C_mean*W_C_mean - (H_C_mean + th_C_mean)*(L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean)) + rho_A_mean*(H_C_mean + th_A_mean + th_B_mean + th_C_mean)*(L_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean) - rho_B_mean*(H_C_mean + th_C_mean)*(L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean);
        Rel7_raw=L_C_mean*W_C_mean*H_C_mean;

        Equaliser_values(1,i_values)=value;
        Equaliser_values(2,i_values)=[zmf(Rel1_raw,[Pr1_minOk, Pr1_aclevel])];
        Equaliser_values(3,i_values)=[zmf(Rel2_raw,[Pr2_minOk, Pr2_aclevel])];
        Equaliser_values(4,i_values)=[zmf(Rel3_raw,[Pr3_minOk, Pr3_aclevel])];
        Equaliser_values(5,i_values)=[zmf(Rel4_raw,[Pr4_minOk, Pr4_aclevel])];
        Equaliser_values(6,i_values)=[zmf(Rel5_raw,[Pr5_minOk, Pr5_aclevel])];
        Equaliser_values(7,i_values)=[zmf(Rel6_raw,[Pr6_minOk, Pr6_aclevel])];
        Equaliser_values(8,i_values)=[pimf(Rel7_raw,[Pr7_minAC,Pr7_minOk,Pr7_aclevel,Pr7_aclevel])];
        Agg_Des=Equaliser_values(2,i_values)*Equaliser_values(3,i_values)*Equaliser_values(4,i_values)*Equaliser_values(5,i_values)*Equaliser_values(6,i_values)*Equaliser_values(7,i_values)*Equaliser_values(8,i_values);


        Equaliser_ranges(1,i_values)=value;
        Equaliser_ranges(2,i_values)=Agg_Des;


        Val_Pr1=[Rel1_raw-273];
        Val_Pr2=[Rel2_raw];
        Val_Pr3=[Rel3_raw];
        Val_Pr4=[Rel4_raw];
        Val_Pr5=[Rel5_raw];
        Val_Pr6=[Rel6_raw];
        Val_Pr7=[Rel7_raw*1000];
        i_values=i_values+1;
    end
elseif(Characteristic=='W_C_')
    %W_C: Domaines(14,1)
    
    for (value=Domaines(14,2):-(Domaines(14,2)-Domaines(14,1))/24:Domaines(14,1)) 
        W_C_mean=value;
        
        Design_variables_values=[T_0_mean
        T_5_mean
        th_A_mean
        K_A_mean
        th_B_mean
        K_B_mean
        th_C_mean
        K_C_mean
        M_mean
        Cp_mean
        t_mean
        m_user_mean
        L_C_mean
        W_C_mean
        H_C_mean
        th_lid_mean
        rho_A_mean
        rho_B_mean
        rho_C_mean];

        Design_variables_full=[Design_variables_values];
        [Delta_T_ext,Delta_T_in] = Determine_DeltaT_Cooler(T_0_mean,T_5_mean,th_A_mean,K_A_mean,th_B_mean,K_B_mean,th_C_mean,K_C_mean,L_C_mean,W_C_mean,H_C_mean);

        %Raw variables definition
        Rel1_raw=T_5_mean + exp((2*H_C_mean*t_mean*(L_C_mean + W_C_mean)*(T_0_mean - T_5_mean))/(Cp_mean*M_mean*(5/(28*(Delta_T_in/(H_C_mean*T_5_mean))^(1/4)) + 5/(28*(Delta_T_ext/(H_C_mean*T_0_mean))^(1/4)) + th_A_mean/K_A_mean + th_B_mean/K_B_mean + th_C_mean/K_C_mean)));
        Rel2_raw=(m_user_mean*9.81)*0.5/((2*th_A_mean+2*th_B_mean+2*th_C_mean)*(L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean));
        Rel3_raw=L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean;
        Rel4_raw=W_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean;
        Rel5_raw=H_C_mean+th_C_mean+th_B_mean+th_A_mean+th_lid_mean;
        Rel6_raw=rho_B_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_A_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_C_mean*(H_C_mean*L_C_mean*W_C_mean - (H_C_mean + th_C_mean)*(L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean)) + rho_A_mean*(H_C_mean + th_A_mean + th_B_mean + th_C_mean)*(L_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean) - rho_B_mean*(H_C_mean + th_C_mean)*(L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean);
        Rel7_raw=L_C_mean*W_C_mean*H_C_mean;

        Equaliser_values(1,i_values)=value;
        Equaliser_values(2,i_values)=[zmf(Rel1_raw,[Pr1_minOk, Pr1_aclevel])];
        Equaliser_values(3,i_values)=[zmf(Rel2_raw,[Pr2_minOk, Pr2_aclevel])];
        Equaliser_values(4,i_values)=[zmf(Rel3_raw,[Pr3_minOk, Pr3_aclevel])];
        Equaliser_values(5,i_values)=[zmf(Rel4_raw,[Pr4_minOk, Pr4_aclevel])];
        Equaliser_values(6,i_values)=[zmf(Rel5_raw,[Pr5_minOk, Pr5_aclevel])];
        Equaliser_values(7,i_values)=[zmf(Rel6_raw,[Pr6_minOk, Pr6_aclevel])];
        Equaliser_values(8,i_values)=[pimf(Rel7_raw,[Pr7_minAC,Pr7_minOk,Pr7_aclevel,Pr7_aclevel])];
        Agg_Des=Equaliser_values(2,i_values)*Equaliser_values(3,i_values)*Equaliser_values(4,i_values)*Equaliser_values(5,i_values)*Equaliser_values(6,i_values)*Equaliser_values(7,i_values)*Equaliser_values(8,i_values);


        Equaliser_ranges(1,i_values)=value;
        Equaliser_ranges(2,i_values)=Agg_Des;


        Val_Pr1=[Rel1_raw-273];
        Val_Pr2=[Rel2_raw];
        Val_Pr3=[Rel3_raw];
        Val_Pr4=[Rel4_raw];
        Val_Pr5=[Rel5_raw];
        Val_Pr6=[Rel6_raw];
        Val_Pr7=[Rel7_raw*1000];
        i_values=i_values+1;
    end
elseif(Characteristic=='H_C_')
    %H_C: Domaines(15,1)
    
    for (value=Domaines(15,2):-(Domaines(15,2)-Domaines(15,1))/24:Domaines(15,1)) 
        H_C_mean=value;
        
        Design_variables_values=[T_0_mean
        T_5_mean
        th_A_mean
        K_A_mean
        th_B_mean
        K_B_mean
        th_C_mean
        K_C_mean
        M_mean
        Cp_mean
        t_mean
        m_user_mean
        L_C_mean
        W_C_mean
        H_C_mean
        th_lid_mean
        rho_A_mean
        rho_B_mean
        rho_C_mean];

        Design_variables_full=[Design_variables_values];
        [Delta_T_ext,Delta_T_in] = Determine_DeltaT_Cooler(T_0_mean,T_5_mean,th_A_mean,K_A_mean,th_B_mean,K_B_mean,th_C_mean,K_C_mean,L_C_mean,W_C_mean,H_C_mean);

        %Raw variables definition
        Rel1_raw=T_5_mean + exp((2*H_C_mean*t_mean*(L_C_mean + W_C_mean)*(T_0_mean - T_5_mean))/(Cp_mean*M_mean*(5/(28*(Delta_T_in/(H_C_mean*T_5_mean))^(1/4)) + 5/(28*(Delta_T_ext/(H_C_mean*T_0_mean))^(1/4)) + th_A_mean/K_A_mean + th_B_mean/K_B_mean + th_C_mean/K_C_mean)));
        Rel2_raw=(m_user_mean*9.81)*0.5/((2*th_A_mean+2*th_B_mean+2*th_C_mean)*(L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean));
        Rel3_raw=L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean;
        Rel4_raw=W_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean;
        Rel5_raw=H_C_mean+th_C_mean+th_B_mean+th_A_mean+th_lid_mean;
        Rel6_raw=rho_B_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_A_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_C_mean*(H_C_mean*L_C_mean*W_C_mean - (H_C_mean + th_C_mean)*(L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean)) + rho_A_mean*(H_C_mean + th_A_mean + th_B_mean + th_C_mean)*(L_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean) - rho_B_mean*(H_C_mean + th_C_mean)*(L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean);
        Rel7_raw=L_C_mean*W_C_mean*H_C_mean;

        Equaliser_values(1,i_values)=value;
        Equaliser_values(2,i_values)=[zmf(Rel1_raw,[Pr1_minOk, Pr1_aclevel])];
        Equaliser_values(3,i_values)=[zmf(Rel2_raw,[Pr2_minOk, Pr2_aclevel])];
        Equaliser_values(4,i_values)=[zmf(Rel3_raw,[Pr3_minOk, Pr3_aclevel])];
        Equaliser_values(5,i_values)=[zmf(Rel4_raw,[Pr4_minOk, Pr4_aclevel])];
        Equaliser_values(6,i_values)=[zmf(Rel5_raw,[Pr5_minOk, Pr5_aclevel])];
        Equaliser_values(7,i_values)=[zmf(Rel6_raw,[Pr6_minOk, Pr6_aclevel])];
        Equaliser_values(8,i_values)=[pimf(Rel7_raw,[Pr7_minAC,Pr7_minOk,Pr7_aclevel,Pr7_aclevel])];
        Agg_Des=Equaliser_values(2,i_values)*Equaliser_values(3,i_values)*Equaliser_values(4,i_values)*Equaliser_values(5,i_values)*Equaliser_values(6,i_values)*Equaliser_values(7,i_values)*Equaliser_values(8,i_values);


        Equaliser_ranges(1,i_values)=value;
        Equaliser_ranges(2,i_values)=Agg_Des;


        Val_Pr1=[Rel1_raw-273];
        Val_Pr2=[Rel2_raw];
        Val_Pr3=[Rel3_raw];
        Val_Pr4=[Rel4_raw];
        Val_Pr5=[Rel5_raw];
        Val_Pr6=[Rel6_raw];
        Val_Pr7=[Rel7_raw*1000];
        i_values=i_values+1;
    end
elseif(Characteristic=='th_l')
    %th_lid_var: Domaines(16,1)
    
    for (value=Domaines(16,2):-(Domaines(16,2)-Domaines(16,1))/24:Domaines(16,1)) 
        th_lid_mean=value;
        
        Design_variables_values=[T_0_mean
        T_5_mean
        th_A_mean
        K_A_mean
        th_B_mean
        K_B_mean
        th_C_mean
        K_C_mean
        M_mean
        Cp_mean
        t_mean
        m_user_mean
        L_C_mean
        W_C_mean
        H_C_mean
        th_lid_mean
        rho_A_mean
        rho_B_mean
        rho_C_mean];

        Design_variables_full=[Design_variables_values];
        [Delta_T_ext,Delta_T_in] = Determine_DeltaT_Cooler(T_0_mean,T_5_mean,th_A_mean,K_A_mean,th_B_mean,K_B_mean,th_C_mean,K_C_mean,L_C_mean,W_C_mean,H_C_mean);

        %Raw variables definition
        Rel1_raw=T_5_mean + exp((2*H_C_mean*t_mean*(L_C_mean + W_C_mean)*(T_0_mean - T_5_mean))/(Cp_mean*M_mean*(5/(28*(Delta_T_in/(H_C_mean*T_5_mean))^(1/4)) + 5/(28*(Delta_T_ext/(H_C_mean*T_0_mean))^(1/4)) + th_A_mean/K_A_mean + th_B_mean/K_B_mean + th_C_mean/K_C_mean)));
        Rel2_raw=(m_user_mean*9.81)*0.5/((2*th_A_mean+2*th_B_mean+2*th_C_mean)*(L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean));
        Rel3_raw=L_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean;
        Rel4_raw=W_C_mean+2*th_C_mean+2*th_B_mean+2*th_A_mean;
        Rel5_raw=H_C_mean+th_C_mean+th_B_mean+th_A_mean+th_lid_mean;
        Rel6_raw=rho_B_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_A_mean*(L_C_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_B_mean + 2*th_C_mean)*(H_C_mean + th_B_mean + th_C_mean) - rho_C_mean*(H_C_mean*L_C_mean*W_C_mean - (H_C_mean + th_C_mean)*(L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean)) + rho_A_mean*(H_C_mean + th_A_mean + th_B_mean + th_C_mean)*(L_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean)*(W_C_mean + 2*th_A_mean + 2*th_B_mean + 2*th_C_mean) - rho_B_mean*(H_C_mean + th_C_mean)*(L_C_mean + 2*th_C_mean)*(W_C_mean + 2*th_C_mean);
        Rel7_raw=L_C_mean*W_C_mean*H_C_mean;

        Equaliser_values(1,i_values)=value;
        Equaliser_values(2,i_values)=[zmf(Rel1_raw,[Pr1_minOk, Pr1_aclevel])];
        Equaliser_values(3,i_values)=[zmf(Rel2_raw,[Pr2_minOk, Pr2_aclevel])];
        Equaliser_values(4,i_values)=[zmf(Rel3_raw,[Pr3_minOk, Pr3_aclevel])];
        Equaliser_values(5,i_values)=[zmf(Rel4_raw,[Pr4_minOk, Pr4_aclevel])];
        Equaliser_values(6,i_values)=[zmf(Rel5_raw,[Pr5_minOk, Pr5_aclevel])];
        Equaliser_values(7,i_values)=[zmf(Rel6_raw,[Pr6_minOk, Pr6_aclevel])];
        Equaliser_values(8,i_values)=[pimf(Rel7_raw,[Pr7_minAC,Pr7_minOk,Pr7_aclevel,Pr7_aclevel])];
        Agg_Des=Equaliser_values(2,i_values)*Equaliser_values(3,i_values)*Equaliser_values(4,i_values)*Equaliser_values(5,i_values)*Equaliser_values(6,i_values)*Equaliser_values(7,i_values)*Equaliser_values(8,i_values);


        Equaliser_ranges(1,i_values)=value;
        Equaliser_ranges(2,i_values)=Agg_Des;


        Val_Pr1=[Rel1_raw-273];
        Val_Pr2=[Rel2_raw];
        Val_Pr3=[Rel3_raw];
        Val_Pr4=[Rel4_raw];
        Val_Pr5=[Rel5_raw];
        Val_Pr6=[Rel6_raw];
        Val_Pr7=[Rel7_raw*1000];
        i_values=i_values+1;
    end
    
else
    Equaliser_values=0;
    Equaliser_ranges=0;
    disp('Error. Please input a characteristic')
       
end


Equaliser_values=Equaliser_values';
Equaliser_ranges=Equaliser_ranges';