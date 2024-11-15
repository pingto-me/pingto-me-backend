import { Injectable } from '@nestjs/common';

@Injectable()
export class SocialPlatformProvider {
  private socialPlatforms = [
    {
      name: 'Facebook',
      icon: 'facebook',
      url: 'https://www.facebook.com/',
    },
    {
      name: 'Instagram',
      icon: 'instagram',
      url: 'https://www.instagram.com/',
    },
    {
      name: 'LinkedIn',
      icon: 'linkedin',
      url: 'https://www.linkedin.com/in/',
    },
    {
      name: 'X',
      icon: 'x',
      url: 'https://x.com/',
    },
    {
      name: 'YouTube',
      icon: 'youtube',
      url: 'https://www.youtube.com/',
    },
    {
      name: 'GitHub',
      icon: 'github',
      url: 'https://github.com/',
    },
    {
      name: 'Website',
      icon: 'website',
      url: '',
    },
  ];

  isExistSocialPlatform(name: string) {
    return this.socialPlatforms.some((platform) => platform.name === name);
  }

  getSocialPlatforms() {
    return this.socialPlatforms;
  }

  getSocialPlatformByName(name: string) {
    return this.socialPlatforms.find((platform) => platform.name === name);
  }

  getSocialPlatformByIcon(icon: string) {
    return this.socialPlatforms.find((platform) => platform.icon === icon);
  }

  getSocialPlatformUrlByName(name: string) {
    const platform = this.getSocialPlatformByName(name);
    return platform ? platform.url : '';
  }

  getFullSocialPlatformUrl(name: string, slug: string) {
    const platform = this.getSocialPlatformByName(name);
    return platform ? platform.url + slug : '';
  }
}
