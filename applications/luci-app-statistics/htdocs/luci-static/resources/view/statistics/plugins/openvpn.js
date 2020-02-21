'use strict';
'require fs';
'require form';

return L.Class.extend({
	title: _('OpenVPN Plugin Configuration'),
	description: _('The OpenVPN plugin gathers information about the current vpn connection status.'),

	addFormOptions: function(s) {
		var o;

		o = s.option(form.Flag, 'enable', _('Enable this plugin'));
		o.default = '0';

		o = s.option(form.Flag, 'CollectIndividualUsers', _('Generate a separate graph for each logged user'));
		o.default = '0';
		o.rmempty = true;
		o.depends('enable', '1');

		o = s.option(form.Flag, 'CollectUserCount', _('Aggregate number of connected users'));
		o.default = '0';
		o.rmempty = true;
		o.depends('enable', '1');

		o = s.option(form.Flag, 'CollectCompression', _('Gather compression statistics'));
		o.default = '0';
		o.rmempty = true;
		o.depends('enable', '1');

		o = s.option(form.Flag, 'ImprovedNamingSchema', _('Use improved naming schema'));
		o.default = '0';
		o.rmempty = true;
		o.depends('enable', '1');

		o = s.option(form.DynamicList, 'StatusFile', _('OpenVPN status files'));
		o.rmempty = true;
		o.depends('enable', '1');
		o.load = function(section_id) {
			return L.resolveDefault(fs.list('/var/run'), []).then(L.bind(function(entries) {
				for (var i = 0; i < entries.length; i++)
					if (entries[i].type == 'file' && entries[i].name.match(/^openvpn\..+\.status$/))
						o.value('/var/run/' + entries[i].name);
			}, this));
		};
	},

	configSummary: function(section) {
		var stats = L.toArray(section.StatusFile);

		if (stats.length)
			return N_(stats.length, 'Monitoring one OpenVPN instance', 'Monitoring %d OpenVPN instancees').format(stats.length);
	}
});