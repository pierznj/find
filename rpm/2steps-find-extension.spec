Name: 2steps-find-extension
Version: %{version}
Release:	1
Summary: 2Steps find extension providing find by regex functionality

Group: Installation script
License: GPL3

Requires:2steps-environment 2steps-execute 2steps-extensions

%description
Provides 'find by regex' functionality accessible to the 2steps browser extension

%build
echo $PWD
mkdir -p %{buildroot}/opt/remasys/2steps/share/chrome-extensions/2steps-find/
cp -r %{_topdir}/build/chr/* %{buildroot}/opt/remasys/2steps/share/chrome-extensions/2steps-find/

%files
%defattr(640, root, 2steps, 755)
/opt/remasys/2steps/share/chrome-extensions/2steps-find/*
%changelog
